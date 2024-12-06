/*
  Warnings:

  - You are about to drop the column `Balance` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Balance",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
