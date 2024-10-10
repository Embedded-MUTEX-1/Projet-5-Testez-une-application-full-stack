package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestPropertySource("classpath:application-test.properties")
@ExtendWith(SpringExtension.class)
@SpringBootTest
@WebAppConfiguration
public class SessionControllerIT {
    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }

    @Test
    public void givenWebAppContext_whenServletContext_thenItProvidesAuthController() {
        ServletContext servletContext = webApplicationContext.getServletContext();

        assertNotNull(servletContext);
        assertInstanceOf(MockServletContext.class, servletContext);
        assertNotNull(webApplicationContext.getBean("sessionController"));
    }

    @Test
    public void whenUserPostCreateSession_thenSessionCreated() throws Exception {
        String json = objectMapper.writeValueAsString(new SessionDto(3L, "Session", new Date(), 1L, "desc", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now()));

        this.mockMvc.perform(post("/api/session")
                        .contentType(APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Session"));
    }

    @Test
    public void whenUserRequestParticipate_thenUserAssociatedToSession() throws Exception {
        this.mockMvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void givenNoUser_whenUserRequestParticipate_thenReturnBadRequest() throws Exception {
        this.mockMvc.perform(post("/api/session/1/participate/5"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void givenNoSession_whenUserRequestParticipate_thenReturnBadRequest() throws Exception {
        this.mockMvc.perform(post("/api/session/5/participate/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenUserRequestNoLongerParticipate_thenUserDisassociatedToSession() throws Exception {
        this.mockMvc.perform(delete("/api/session/2/participate/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void givenNoSession_whenUserRequestNoLongerParticipate_thenReturnBadRequest() throws Exception {
        this.mockMvc.perform(delete("/api/session/5/participate/1"))
                .andExpect(status().isNotFound());
    }
}
