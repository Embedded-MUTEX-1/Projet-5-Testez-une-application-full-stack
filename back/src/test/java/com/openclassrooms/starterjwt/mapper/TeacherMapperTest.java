package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class TeacherMapperTest {
    private final TeacherMapper teacherMapper;

    LocalDateTime localDateTime = LocalDateTime.now();

    @Autowired
    TeacherMapperTest(TeacherMapper teacherMapper) {
        this.teacherMapper = teacherMapper;
    }

    Teacher teacher = new Teacher(
            1L, "Toto", "Titi", localDateTime, localDateTime
    );

    TeacherDto teacherDto = new TeacherDto(
            1L, "Toto", "Titi", localDateTime, localDateTime
    );

    @Test
    void toTeacherTest() {
        Teacher result = teacherMapper.toEntity(teacherDto);

        assertThat(result).isEqualTo(teacher);
    }

    @Test
    void toDtoTest() {
        TeacherDto result = teacherMapper.toDto(teacher);

        assertThat(result).isEqualTo(teacherDto);
    }

    @Test
    void toTeacheristTest() {
        List<Teacher> result = teacherMapper.toEntity(Arrays.asList(teacherDto, teacherDto));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(teacher);
        assertThat(result.get(1)).isEqualTo(teacher);
    }

    @Test
    void toDtoListTest() {
        List<TeacherDto> result = teacherMapper.toDto(Arrays.asList(teacher, teacher));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(teacherDto);
        assertThat(result.get(1)).isEqualTo(teacherDto);
    }
}
