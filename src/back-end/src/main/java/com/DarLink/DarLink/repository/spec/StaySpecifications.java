package com.DarLink.DarLink.repository.spec;

import com.DarLink.DarLink.entity.Stay;
import org.springframework.data.jpa.domain.Specification;

public final class StaySpecifications {

    private StaySpecifications() {
    }

    public static Specification<Stay> cityEquals(String city) {
        return (root, query, cb) -> {
            if (city == null || city.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase());
        };
    }

    public static Specification<Stay> roomTypeEquals(String roomType) {
        return (root, query, cb) -> {
            if (roomType == null || roomType.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("roomType")), roomType.trim().toLowerCase());
        };
    }

    public static Specification<Stay> minPrice(Double minPrice) {
        return (root, query, cb) -> minPrice == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice);
    }

    public static Specification<Stay> maxPrice(Double maxPrice) {
        return (root, query, cb) -> maxPrice == null
                ? cb.conjunction()
                : cb.lessThan(root.get("pricePerNight"), maxPrice);
    }
}

