-- AlterTable
ALTER TABLE "public"."Idea" ADD COLUMN     "auctionDuration" INTEGER DEFAULT 7,
ADD COLUMN     "startingPrice" DOUBLE PRECISION DEFAULT 0;
