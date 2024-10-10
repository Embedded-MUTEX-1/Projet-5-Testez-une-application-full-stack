package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerTest {
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    private Teacher teacher;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }

    @BeforeEach
    public void init() {
        teacher = new Teacher(1L, "Toto", "Titi",  LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    public void givenNoTeacher_whenFindTeacher_thenReturnNotFound() throws Exception {
        when(teacherService.findById(1L)).thenReturn(null);

        this.mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenFindTeacherWithBadParam_thenReturnBadRequest() throws Exception {

        this.mockMvc.perform(get("/api/teacher/bad"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenFindTeacher_thenReturnTeacher() throws Exception {
        when(teacherService.findById(1L)).thenReturn(teacher);

        this.mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacher.getId()));
    }

    @Test
    public void whenFindAllTeacher_thenReturnAllTeacher() throws Exception {
    when(teacherService.findAll()).thenReturn(Arrays.asList(teacher, teacher));

        this.mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(teacher.getId()))
                .andExpect(jsonPath("$[1].id").value(teacher.getId()));
    }
}
