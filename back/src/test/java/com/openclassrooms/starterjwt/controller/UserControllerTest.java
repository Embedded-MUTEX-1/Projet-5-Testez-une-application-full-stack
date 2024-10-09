package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private final long USER_ID = 1L;

    private User user;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }

    @BeforeEach
    public void init() {
        user = new User(1L, "test@tets.com", "Toto", "Titi", "123456789", false, LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    public void givenNoUser_whenFindUser_thenReturnNotFound() throws Exception {
        when(userService.findById(1L)).thenReturn(null);

        this.mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenFindUserWithBadParam_thenReturnBadRequest() throws Exception {

        this.mockMvc.perform(get("/api/user/bad"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void givenNoUser_whenDeleteUser_thenReturnNotFound() throws Exception {
        when(userService.findById(1L)).thenReturn(null);

        this.mockMvc.perform(delete("/api/user/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "test2@test.com")
    public void whenDeleteUserWithDifferentUser_thenReturnUnauthorized() throws Exception {
        when(userService.findById(1L)).thenReturn(user);

        this.mockMvc.perform(delete("/api/user/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void whenDeleteUserWithBadParam_thenReturnBadRequest() throws Exception {

        this.mockMvc.perform(delete("/api/user/bad"))
                .andExpect(status().isBadRequest());
    }
}
