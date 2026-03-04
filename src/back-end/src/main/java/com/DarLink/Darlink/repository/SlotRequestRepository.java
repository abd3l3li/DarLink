package com.DarLink.Darlink.repository;
import com.DarLink.Darlink.entity.SlotRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlotRequestRepository extends JpaRepository<SlotRequest, Long> {
    List<SlotRequest> findByGuestId(Long guestId); // Requests I made
    List<SlotRequest> findByStayHostId(Long hostId); // Requests for my properties
}