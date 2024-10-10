package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerTest {
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SessionService sessionService;

    private final long USER_ID = 1L;
    private final long SESSION_ID = 1L;

    private Session session;
    private User user;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }

    @BeforeEach
    public void init() {
        user = new User();
        user.setId(USER_ID);
        session = new Session(
                    SESSION_ID,
                    "My session",
                    new Date(),
                    "Description",
                    new Teacher(),
                    Arrays.asList(user),
                    LocalDateTime.now(),
                    LocalDateTime.now()
                );
    }

    @Test
    public void whenDeleteSession_thenReturnOk() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);
        doNothing().when(sessionService).delete(1L);

        this.mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void whenFindSession_thenReturnSession() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);

        this.mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SESSION_ID));
    }

    @Test
    public void givenNoSession_whenFindSession_thenReturnNotFound() throws Exception {
        when(sessionService.getById(1L)).thenReturn(null);

        this.mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenFindSessionWithBadParam_thenReturnNotFound() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);

        this.mockMvc.perform(get("/api/session/bad"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void givenNoSession_whenDeleteSession_thenReturnNotFound() throws Exception {
        this.mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenDeleteSessionWithBadParam_thenReturnNotFound() throws Exception {
        this.mockMvc.perform(delete("/api/session/bad"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenFindAllSession_thenReturnAllSession() throws Exception {
        when(sessionService.findAll()).thenReturn(Arrays.asList(session, session));

        this.mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(SESSION_ID))
                .andExpect(jsonPath("$[1].id").value(SESSION_ID));
        ;
    }

    @Test
    public void whenUpdateSession_thenReturnSession() throws Exception {
        String json = objectMapper.writeValueAsString(new SessionDto(1L, "Session", new Date(), 1L, "desc", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now()));

        when(sessionService.update(1L, session)).thenReturn(session);

        this.mockMvc.perform(put("/api/session/1")
                        .contentType("application/json")
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SESSION_ID));
    }
}
