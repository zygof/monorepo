-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'EXPIRED');

-- AlterTable: Appointment — champs paiement
ALTER TABLE "Appointment" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE "Appointment" ADD COLUMN "depositAmount" INTEGER;
ALTER TABLE "Appointment" ADD COLUMN "depositPaidAt" TIMESTAMP(3);
ALTER TABLE "Appointment" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "stripeRefundId" TEXT;

-- AlterTable: User — Stripe customer ID
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_stripePaymentIntentId_key" ON "Appointment"("stripePaymentIntentId");
CREATE INDEX "Appointment_stripePaymentIntentId_idx" ON "Appointment"("stripePaymentIntentId");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
