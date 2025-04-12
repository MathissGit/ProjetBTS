<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250412224829 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE status_reservation (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reservation ADD status_reservation_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reservation ADD CONSTRAINT FK_42C84955387A387D FOREIGN KEY (status_reservation_id) REFERENCES status_reservation (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_42C84955387A387D ON reservation (status_reservation_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955387A387D
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE status_reservation
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_42C84955387A387D ON reservation
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reservation DROP status_reservation_id
        SQL);
    }
}
