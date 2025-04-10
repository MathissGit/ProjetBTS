<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250410123915 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE detail_reservation (id INT AUTO_INCREMENT NOT NULL, id_produit_id INT NOT NULL, id_reservation_id INT NOT NULL, INDEX IDX_2DC32404AABEFE2C (id_produit_id), INDEX IDX_2DC3240485542AE1 (id_reservation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE detail_reservation ADD CONSTRAINT FK_2DC32404AABEFE2C FOREIGN KEY (id_produit_id) REFERENCES produit (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE detail_reservation ADD CONSTRAINT FK_2DC3240485542AE1 FOREIGN KEY (id_reservation_id) REFERENCES reservation (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE detail_reservation DROP FOREIGN KEY FK_2DC32404AABEFE2C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE detail_reservation DROP FOREIGN KEY FK_2DC3240485542AE1
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE detail_reservation
        SQL);
    }
}
