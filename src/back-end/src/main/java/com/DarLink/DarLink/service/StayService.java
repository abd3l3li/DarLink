package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.CreateStayRequest;
import com.DarLink.DarLink.dto.StayResponse;
import com.DarLink.DarLink.dto.StayResponse.OwnerResponse;
import com.DarLink.DarLink.entity.Stay;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.StayRepository;
import com.DarLink.DarLink.repository.spec.StaySpecifications;
import com.DarLink.DarLink.util.JsonListConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StayService {

    private final StayRepository stayRepository;

    public StayResponse createStay(CreateStayRequest request, User host) {
        Stay stay = new Stay();
        stay.setName(resolveName(request, null));
        stay.setDescription(request.getDescription());
        stay.setCity(request.getCity());
        stay.setAddress(request.getAddress());
        stay.setRoomType(request.getRoomType());
        stay.setPricePerNight(request.getPricePerNight());
        stay.setAvailableSlots(request.getAvailableSlots());
        stay.setHost(host);

        if (request.getPhotos() != null && !request.getPhotos().isEmpty()) {
            stay.setPhotos(JsonListConverter.toJson(request.getPhotos()));
            stay.setPhotoUrl(request.getPhotos().get(0));
        } else if (hasText(request.getPhotoUrl())) {
            stay.setPhotoUrl(request.getPhotoUrl().trim());
            stay.setPhotos(JsonListConverter.toJson(List.of(request.getPhotoUrl().trim())));
        }

        if (request.getIncluded() != null) {
            stay.setIncluded(JsonListConverter.toJson(request.getIncluded()));
        }

        if (request.getExpectations() != null) {
            stay.setExpectations(JsonListConverter.toJson(request.getExpectations()));
        }

        Stay savedStay = stayRepository.save(stay);
        return toResponse(savedStay);
    }

    public List<StayResponse> getAllStays() {
        return stayRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> searchStays(String location, String type, String price) {
        String normalizedLocation = normalizeText(location);
        String normalizedType = parseRoomTypeFilter(type);
        PriceBounds priceBounds = parsePriceRange(price);

        Specification<Stay> spec = Specification
                .where(StaySpecifications.cityEquals(normalizedLocation))
                .and(StaySpecifications.roomTypeEquals(normalizedType))
                .and(StaySpecifications.minPrice(priceBounds.min()))
                .and(StaySpecifications.maxPrice(priceBounds.max()));

        return stayRepository.findAll(spec, Sort.by("createdAt").descending())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> filterByCity(String city) {
        if (!hasText(city)) {
            return getAllStays();
        }
        return stayRepository.findByCityIgnoreCase(city.trim())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> filterByMaxPrice(Double maxPrice) {
        if (maxPrice == null || maxPrice <= 0) {
            return getAllStays();
        }
        return stayRepository.findByPricePerNightLessThanEqual(maxPrice)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> getMyListings(User host) {
        return stayRepository.findByHostId(host.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StayResponse getStayById(Long id) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stay not found with id: " + id));

        return toResponse(stay);
    }

    public List<StayResponse> getStaysByCity(String city) {
        return stayRepository.findByCityIgnoreCase(city)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StayResponse> getStaysByMaxPrice(Double maxPrice) {
        return stayRepository.findByPricePerNightLessThanEqual(maxPrice)
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
        response.setRoomType(stay.getRoomType());
        response.setPricePerNight(stay.getPricePerNight());
        response.setPhotoUrl(stay.getPhotoUrl());
        response.setAvailableSlots(stay.getAvailableSlots());
        response.setCreatedAt(stay.getCreatedAt());

        List<String> photos = new ArrayList<>(JsonListConverter.fromJson(stay.getPhotos()));
        if (photos.isEmpty() && hasText(stay.getPhotoUrl())) {
            photos.add(stay.getPhotoUrl().trim());
        }
        response.setPhotos(photos);
        response.setIncluded(JsonListConverter.fromJson(stay.getIncluded()));
        response.setExpectations(JsonListConverter.fromJson(stay.getExpectations()));

        if (stay.getHost() != null) {
            response.setHostId(stay.getHost().getId());
            response.setHostUsername(stay.getHost().getUsername());
            response.setHostAvatarUrl(stay.getHost().getAvatarUrl());

            OwnerResponse owner = new OwnerResponse(
                    stay.getHost().getId(),
                    stay.getHost().getUsername(),
                    stay.getHost().getAvatarUrl()
            );
            response.setOwner(owner);
        }

        return response;
    }

    public StayResponse updateStay(Long id, CreateStayRequest request, User currentUser) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stay not found with id: " + id));

        if (!stay.getHost().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the host of this stay");
        }

        stay.setName(resolveName(request, stay));
        stay.setDescription(request.getDescription());
        stay.setCity(request.getCity());
        stay.setAddress(request.getAddress());
        stay.setRoomType(request.getRoomType());
        stay.setPricePerNight(request.getPricePerNight());
        stay.setAvailableSlots(request.getAvailableSlots());

        if (request.getPhotos() != null && !request.getPhotos().isEmpty()) {
            stay.setPhotos(JsonListConverter.toJson(request.getPhotos()));
            stay.setPhotoUrl(request.getPhotos().get(0));
        } else if (hasText(request.getPhotoUrl())) {
            stay.setPhotoUrl(request.getPhotoUrl().trim());
            stay.setPhotos(JsonListConverter.toJson(List.of(request.getPhotoUrl().trim())));
        }

        if (request.getIncluded() != null) {
            stay.setIncluded(JsonListConverter.toJson(request.getIncluded()));
        }

        if (request.getExpectations() != null) {
            stay.setExpectations(JsonListConverter.toJson(request.getExpectations()));
        }

        return toResponse(stayRepository.save(stay));
    }

    public void deleteStay(Long id, User currentUser) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stay not found with id: " + id));

        if (!stay.getHost().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the host of this stay");
        }

        stayRepository.delete(stay);
    }

    private record PriceBounds(Double min, Double max) {}

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String normalizeText(String value) {
        if (!hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private String parseRoomTypeFilter(String type) {
        String normalizedType = normalizeText(type);
        if (normalizedType == null || normalizedType.equals("Both")) {
            return null;
        }
        return normalizedType;
    }

    private PriceBounds parsePriceRange(String price) {
        if (price == null || price.isBlank()) {
            return new PriceBounds(null, null);
        }

        return switch (price.trim()) {
            case "0 - 1000 DH" -> new PriceBounds(0.0, 1000.0);
            case "1000 - 2000 DH" -> new PriceBounds(1000.0, 2000.0);
            case "2000+ DH" -> new PriceBounds(2000.0, null);
            default -> throw new IllegalArgumentException("Invalid price filter: " + price);
        };
    }

    private String resolveName(CreateStayRequest request, Stay existingStay) {
        if (hasText(request.getName())) {
            return request.getName().trim();
        }
        if (existingStay != null && hasText(existingStay.getName())) {
            return existingStay.getName();
        }

        String room = hasText(request.getRoomType()) ? request.getRoomType().trim() : "Room";
        String city = hasText(request.getCity()) ? request.getCity().trim() : "Unknown city";
        return room + " in " + city;
    }

    public Page<StayResponse> getStaysPage(int page) {
        Pageable pageable = PageRequest.of(page, 6, Sort.by("createdAt").descending());
        return stayRepository.findAll(pageable).map(this::toResponse);
    }
}