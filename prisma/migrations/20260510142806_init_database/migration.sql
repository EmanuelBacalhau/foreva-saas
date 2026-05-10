-- CreateTable
CREATE TABLE "LovePage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "greeting" TEXT,
    "letterBody" TEXT NOT NULL,
    "signature" TEXT,
    "passwordHash" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LovePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "pageId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "abacateId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "brCode" TEXT,
    "brCodeBase64" TEXT,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LovePage_slug_key" ON "LovePage"("slug");

-- CreateIndex
CREATE INDEX "LovePage_slug_idx" ON "LovePage"("slug");

-- CreateIndex
CREATE INDEX "Image_pageId_idx" ON "Image"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_pageId_key" ON "Payment"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_abacateId_key" ON "Payment"("abacateId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "LovePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "LovePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
