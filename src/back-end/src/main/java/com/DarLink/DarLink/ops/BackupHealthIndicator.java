package com.DarLink.DarLink.ops;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * OPS-ONLY: Isolated health indicator that inspects the latest database backup.
 *
 * It reads a timestamp written by backup.sh into /var/backups/darlink/last_backup.
 * This class has zero coupling to any domain entity, service, or repository.
 *
 * Status rules:
 *  - UP      → backup exists AND is less than 25 hours old
 *  - UNKNOWN → timestamp file does not exist yet (first run)
 *  - DOWN    → backup is stale (older than 25 hours) or file is unreadable
 */
@Component
public class BackupHealthIndicator implements HealthIndicator {

    /** Path written by backup.sh after every successful dump. */
    private static final Path LAST_BACKUP_FILE =
            Paths.get("/var/backups/darlink/last_backup");

    /** Alert threshold — backups older than this are considered stale. */
    private static final long MAX_AGE_HOURS = 25;

    @Override
    public Health health() {
        if (!Files.exists(LAST_BACKUP_FILE)) {
            return Health.unknown()
                    .withDetail("message", "No backup timestamp found — backup has never run")
                    .withDetail("expectedFile", LAST_BACKUP_FILE.toString())
                    .build();
        }

        try {
            String raw = Files.readString(LAST_BACKUP_FILE).strip();
            Instant lastBackup = Instant.parse(raw);
            long ageHours = ChronoUnit.HOURS.between(lastBackup, Instant.now());

            if (ageHours <= MAX_AGE_HOURS) {
                return Health.up()
                        .withDetail("lastBackup", raw)
                        .withDetail("ageHours", ageHours)
                        .build();
            } else {
                return Health.down()
                        .withDetail("lastBackup", raw)
                        .withDetail("ageHours", ageHours)
                        .withDetail("message", "Backup is stale — last backup was " + ageHours + " hours ago")
                        .build();
            }
        } catch (IOException e) {
            return Health.down(e)
                    .withDetail("message", "Could not read backup timestamp file")
                    .withDetail("file", LAST_BACKUP_FILE.toString())
                    .build();
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("message", "Invalid timestamp format in backup file")
                    .build();
        }
    }
}
