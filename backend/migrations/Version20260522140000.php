<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260522140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Crée la table titres et insère les titres RPG par niveau';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE titres (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, niveau_min INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_TITRES_NIVEAU_MIN ON titres (niveau_min)');

        $this->addSql("INSERT INTO titres (nom, niveau_min) VALUES
            ('Débutant', 1),
            ('Aventurier', 5),
            ('Guerrier', 10),
            ('Maître', 15),
            ('Légende', 20)");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE titres');
    }
}
