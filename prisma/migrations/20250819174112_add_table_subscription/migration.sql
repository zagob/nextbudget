-- CreateEnum
CREATE TYPE "nextbudget"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID', 'TRIAL');

-- CreateEnum
CREATE TYPE "nextbudget"."PlanType" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "nextbudget"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "nextbudget"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "nextbudget"."PlanType" NOT NULL DEFAULT 'FREE',
    "status" "nextbudget"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" "nextbudget"."BillingCycle",
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "maxAccountBanks" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "nextbudget"."Subscription"("userId");

-- AddForeignKey
ALTER TABLE "nextbudget"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nextbudget"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
