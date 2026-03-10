package com.DarLink.DarLink.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.DarLink.DarLink.entity.Stay;

@Repository
public interface StayRepository extends JpaRepository<Stay, Long> {

    // Find all stays in a specific city (Useful for Phase 4 Search)
    List<Stay> findByCityIgnoreCase(String city);

    // Find all stays hosted by a specific user
    List<Stay> findByHostId(Long hostId);

    // Find stays cheaper than a certain price
    List<Stay> findByPricePerNightLessThan(Double pricePerNight);
}