<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260522120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute youtube_url sur la table post';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post ADD youtube_url VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post DROP youtube_url');
    }
}
