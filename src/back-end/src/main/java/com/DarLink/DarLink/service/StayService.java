package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.CreateStayRequest;
import com.DarLink.DarLink.dto.StayResponse;
import com.DarLink.DarLink.entity.Stay;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StayService {

    private final StayRepository stayRepository;

    public StayResponse createStay(CreateStayRequest request, User host) {
        Stay stay = new Stay();
        stay.setName(request.getName());
        stay.setDescription(request.getDescription());
        stay.setCity(request.getCity());
        stay.setAddress(request.getAddress());
        stay.setPricePerNight(request.getPricePerNight());
        stay.setPhotoUrl(request.getPhotoUrl());
        stay.setHost(host);

        Stay savedStay = stayRepository.save(stay);
        return toResponse(savedStay);
    }

    public List<StayResponse> getAllStays() {
        return stayRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StayResponse getStayById(Long id) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stay not found with id: " + id));

        return toResponse(stay);
    }

    public List<StayResponse> getStaysByCity(String city) {
        return stayRepository.findByCityIgnoreCase(city)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> getStaysByMaxPrice(Double maxPrice) {
        return stayRepository.findByPricePerNightLessThan(maxPrice)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> getStaysByHost(Long hostId) {
        return stayRepository.findByHostId(hostId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StayResponse toResponse(Stay stay) {
        StayResponse response = new StayResponse();
        response.setId(stay.getId());
        response.setName(stay.getName());
        response.setDescription(stay.getDescription());
        response.setCity(stay.getCity());
        response.setAddress(stay.getAddress());
        response.setPricePerNight(stay.getPricePerNight());
        response.setPhotoUrl(stay.getPhotoUrl());
        response.setCreatedAt(stay.getCreatedAt());

        if (stay.getHost() != null) {
            response.setHostId(stay.getHost().getId());
            response.setHostUsername(stay.getHost().getUsername());
        }

        return response;
    }
    public StayResponse updateStay(Long id, CreateStayRequest request, User currentUser) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stay not found with id: " + id));

        if (!stay.getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not the host of this stay");
        }

        stay.setName(request.getName());
        stay.setDescription(request.getDescription());
        stay.setCity(request.getCity());
        stay.setAddress(request.getAddress());
        stay.setPricePerNight(request.getPricePerNight());
        stay.setPhotoUrl(request.getPhotoUrl());

        return toResponse(stayRepository.save(stay));
    }

    public void deleteStay(Long id, User currentUser) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stay not found with id: " + id));

        if (!stay.getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not the host of this stay");
        }

        stayRepository.delete(stay);
    }
    private record PriceBounds(Double min, Double max) {}

    private PriceBounds parsePriceRange(String price) {
        if (price == null || price.isBlank()) return new PriceBounds(null, null);

        return switch (price.trim()) {
            case "0 - 1000 DH" -> new PriceBounds(0.0, 1000.0);
            case "1000 - 2000 DH" -> new PriceBounds(1000.0, 2000.0);
            case "2000+ DH" -> new PriceBounds(2000.0, null);
            default -> throw new IllegalArgumentException("Invalid price filter: " + price);
        };
    }


    public Page<StayResponse> getStaysPage(int page) {
        Pageable pageable = PageRequest.of(page, 9, Sort.by("createdAt").descending());
        return stayRepository.findAll(pageable).map(this::toResponse);
    }
}
