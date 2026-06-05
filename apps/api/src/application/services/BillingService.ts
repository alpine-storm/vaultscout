import type { BillingStatusDto, CheckoutResponseDto } from "@vaultscout/shared";
import type { PlatformSubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "../../infrastructure/database/prisma";
import { env } from "../../config/env";
import { AppError } from "../../domain/errors/AppError";

const PLAN = {
  name: "Strategy Engine Pro",
  priceUsd: 49,
  interval: "month" as const,
};

export class BillingService {
  private stripe: Stripe | null = null;

  constructor() {
    if (env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
    }
  }

  isMockMode(): boolean {
    return env.BILLING_MOCK || !this.stripe;
  }

  async getStatus(userId: string): Promise<BillingStatusDto> {
    const sub = await this.getOrCreateSubscription(userId);
    const active = this.isActiveStatus(sub.status, sub.currentPeriodEnd);

    return {
      status: sub.status as BillingStatusDto["status"],
      active,
      currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
      planName: PLAN.name,
      priceUsd: PLAN.priceUsd,
      interval: PLAN.interval,
      mockMode: this.isMockMode(),
    };
  }

  async requireActiveSubscription(userId: string): Promise<void> {
    const status = await this.getStatus(userId);
    if (!status.active) {
      throw new AppError(
        "An active Strategy Engine subscription is required. Subscribe to continue.",
        402
      );
    }
  }

  async createCheckoutSession(
    userId: string,
    walletAddress: string
  ): Promise<CheckoutResponseDto> {
    if (this.isMockMode()) {
      await this.activateMockSubscription(userId);
      return {
        url: `${env.APP_URL}/strategies?billing=success`,
        mock: true,
      };
    }

    if (!env.STRIPE_PRICE_ID) {
      throw new AppError("Stripe price ID is not configured", 500);
    }

    const sub = await this.getOrCreateSubscription(userId);
    const customerId = await this.ensureStripeCustomer(
      userId,
      walletAddress,
      sub.stripeCustomerId
    );

    const session = await this.stripe!.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${env.APP_URL}/strategies?billing=success`,
      cancel_url: `${env.APP_URL}/strategies?billing=canceled`,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
    });

    if (!session.url) {
      throw new AppError("Failed to create checkout session", 500);
    }

    return { url: session.url };
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    if (this.isMockMode()) {
      throw new AppError("Billing portal is not available in mock mode", 400);
    }

    const sub = await prisma.platformSubscription.findUnique({
      where: { userId },
    });

    if (!sub?.stripeCustomerId) {
      throw new AppError("No billing account found", 404);
    }

    const session = await this.stripe!.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${env.APP_URL}/strategies`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    if (this.isMockMode()) {
      throw new AppError("Webhooks are disabled in mock billing mode", 400);
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError("Stripe webhook secret is not configured", 500);
    }

    const event = this.stripe!.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          const stripeSub = await this.stripe!.subscriptions.retrieve(
            String(session.subscription)
          );
          await this.syncStripeSubscription(userId, stripeSub);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const userId = stripeSub.metadata?.userId;
        if (userId) {
          await this.syncStripeSubscription(userId, stripeSub);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription;
        if (subId) {
          const stripeSub = await this.stripe!.subscriptions.retrieve(
            String(subId)
          );
          const userId = stripeSub.metadata?.userId;
          if (userId) {
            await this.syncStripeSubscription(userId, stripeSub);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  private async activateMockSubscription(userId: string): Promise<void> {
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    await prisma.platformSubscription.upsert({
      where: { userId },
      update: {
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId,
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
      },
    });
  }

  private async syncStripeSubscription(
    userId: string,
    stripeSub: Stripe.Subscription
  ): Promise<void> {
    const status = this.mapStripeStatus(stripeSub.status);
    const periodEnd = new Date(stripeSub.current_period_end * 1000);

    await prisma.platformSubscription.upsert({
      where: { userId },
      update: {
        status,
        stripeSubscriptionId: stripeSub.id,
        stripeCustomerId: String(stripeSub.customer),
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId,
        status,
        stripeSubscriptionId: stripeSub.id,
        stripeCustomerId: String(stripeSub.customer),
        currentPeriodEnd: periodEnd,
      },
    });
  }

  private mapStripeStatus(
    status: Stripe.Subscription.Status
  ): PlatformSubscriptionStatus {
    switch (status) {
      case "active":
        return "ACTIVE";
      case "trialing":
        return "TRIALING";
      case "past_due":
      case "unpaid":
        return "PAST_DUE";
      case "canceled":
      case "incomplete_expired":
        return "CANCELED";
      default:
        return "NONE";
    }
  }

  private async ensureStripeCustomer(
    userId: string,
    walletAddress: string,
    existingCustomerId: string | null
  ): Promise<string> {
    if (existingCustomerId) return existingCustomerId;

    const customer = await this.stripe!.customers.create({
      metadata: { userId, walletAddress },
    });

    await prisma.platformSubscription.update({
      where: { userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  private async getOrCreateSubscription(userId: string) {
    return prisma.platformSubscription.upsert({
      where: { userId },
      update: {},
      create: { userId, status: "NONE" },
    });
  }

  private isActiveStatus(
    status: PlatformSubscriptionStatus,
    periodEnd: Date | null
  ): boolean {
    if (status !== "ACTIVE" && status !== "TRIALING") return false;
    if (!periodEnd) return status === "ACTIVE" || status === "TRIALING";
    return periodEnd.getTime() > Date.now();
  }
}
