-- CreateTable
CREATE TABLE "public"."Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "status" TEXT NOT NULL,
    "owner" TEXT,
    "ownerName" TEXT,
    "views" INTEGER DEFAULT 0,
    "likes" INTEGER DEFAULT 0,
    "technicalDetails" TEXT,
    "marketPotential" TEXT,
    "competitiveAdvantage" TEXT,
    "implementationPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "owner" TEXT,
    "ownerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ideaId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
