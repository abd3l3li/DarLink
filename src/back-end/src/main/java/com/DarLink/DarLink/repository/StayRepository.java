package com.DarLink.DarLink.repository;

import com.DarLink.DarLink.entity.Stay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayRepository extends JpaRepository<Stay, Long>, JpaSpecificationExecutor<Stay> {

    List<Stay> findByCityIgnoreCase(String city);

    List<Stay> findByPricePerNightLessThan(Double price);

    List<Stay> findByPricePerNightLessThanEqual(Double price);

    List<Stay> findByHostId(Long hostId);

    List<Stay> findByRoomType(String roomType);
}