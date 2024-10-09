package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    public void testGetAllTeacher() {
        when(teacherRepository.findAll()).thenReturn(Arrays.asList(new Teacher(), new Teacher()));

        List<Teacher> teachers = teacherService.findAll();

        assertThat(teachers.size()).isEqualTo(2);
    }

    @ParameterizedTest(name = "Should get teacher with {0} as id")
    @ValueSource(longs = {0, 1, 2})
    public void testGetTeacher(long id) {
        when(teacherRepository.findById(id)).thenReturn(Optional.of(new Teacher(
            1L, "Toto", "Titi", LocalDateTime.now(), LocalDateTime.now()
        )));

        Teacher teacher = teacherService.findById(id);

        verify(teacherRepository, times(1)).findById(id);
        assertThat(teacher).isNotNull();
    }
}
