-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "project_files" ADD COLUMN     "displayName" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE INDEX "projects_visibility_idx" ON "projects"("visibility");
