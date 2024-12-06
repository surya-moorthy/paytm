-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "Balance" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_UserId_key" ON "Account"("UserId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
