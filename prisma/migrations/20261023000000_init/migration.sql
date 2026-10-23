-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(500) NULL,
    `timezone` VARCHAR(64) NOT NULL DEFAULT 'America/Santiago',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` CHAR(36) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(64) NULL,
    `userAgent` VARCHAR(500) NULL,
    `userId` CHAR(36) NOT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    INDEX `session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` CHAR(36) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(64) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(500) NULL,
    `password` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `account_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` CHAR(36) NOT NULL,
    `identifier` VARCHAR(255) NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `verification_identifier_idx`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `color` VARCHAR(7) NOT NULL,
    `icon` VARCHAR(40) NOT NULL DEFAULT 'circle',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `category_userId_idx`(`userId`),
    UNIQUE INDEX `category_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(160) NOT NULL,
    `date` DATE NOT NULL,
    `paymentMethod` ENUM('CASH', 'DEBIT', 'CREDIT', 'TRANSFER', 'WALLET', 'OTHER') NOT NULL DEFAULT 'CASH',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `expense_userId_date_idx`(`userId`, `date` DESC),
    INDEX `expense_userId_categoryId_date_idx`(`userId`, `categoryId`, `date` DESC),
    INDEX `expense_userId_amount_idx`(`userId`, `amount` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NULL,
    `year` SMALLINT NOT NULL,
    `month` SMALLINT NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `budget_userId_year_month_idx`(`userId`, `year`, `month`),
    UNIQUE INDEX `budget_userId_year_month_categoryId_key`(`userId`, `year`, `month`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- Restricciones de dominio (no expresables en schema.prisma)
-- ─────────────────────────────────────────────────────────────

-- Un solo presupuesto general por usuario, año y mes.
-- MySQL no tiene índices parciales: se usa un índice único funcional
-- que sustituye el NULL por un UUID centinela.
CREATE UNIQUE INDEX `budget_user_period_key`
    ON `budget` (`userId`, `year`, `month`,
        (COALESCE(`categoryId`, '00000000-0000-0000-0000-000000000000')));

-- Montos estrictamente positivos.
ALTER TABLE `expense` ADD CONSTRAINT `expense_amount_positive` CHECK (`amount` > 0);
ALTER TABLE `budget`  ADD CONSTRAINT `budget_amount_positive`  CHECK (`amount` > 0);

-- Mes y año válidos.
ALTER TABLE `budget` ADD CONSTRAINT `budget_month_range` CHECK (`month` BETWEEN 1 AND 12);
ALTER TABLE `budget` ADD CONSTRAINT `budget_year_range`  CHECK (`year` BETWEEN 2000 AND 2100);

-- Color hexadecimal de 6 dígitos (ej. #22C55E).
ALTER TABLE `category` ADD CONSTRAINT `category_color_hex`
    CHECK (`color` REGEXP '^#[0-9A-Fa-f]{6}$');

-- Descripción con contenido real.
ALTER TABLE `expense` ADD CONSTRAINT `expense_description_length`
    CHECK (CHAR_LENGTH(TRIM(`description`)) BETWEEN 2 AND 160);
