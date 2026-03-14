-- CreateEnum
CREATE TYPE "ModRequestType" AS ENUM ('REASSIGN', 'REFUSE', 'RESCHEDULE', 'OTHER');

-- CreateEnum
CREATE TYPE "ModRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'BOOKING_STYLIST_CHANGED';

-- CreateTable
CREATE TABLE "ModificationRequest" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "type" "ModRequestType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ModRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModificationRequest_status_idx" ON "ModificationRequest"("status");

-- CreateIndex
CREATE INDEX "ModificationRequest_appointmentId_idx" ON "ModificationRequest"("appointmentId");

-- CreateIndex
CREATE INDEX "ModificationRequest_requesterId_idx" ON "ModificationRequest"("requesterId");

-- AddForeignKey
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
