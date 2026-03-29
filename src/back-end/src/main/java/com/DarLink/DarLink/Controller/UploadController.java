package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.UploadResponse;
import com.DarLink.DarLink.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No files provided");
        }
        if (files.size() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max 5 files allowed");
        }

        List<String> urls = files.stream()
                .map(fileStorageService::storeImage)
                .toList();

        return ResponseEntity.ok(new UploadResponse(urls));
    }
}
