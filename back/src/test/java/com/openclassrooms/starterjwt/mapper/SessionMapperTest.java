package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class SessionMapperTest {
    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapper sessionMapper;

    LocalDateTime localDateTime = LocalDateTime.now();

    @Autowired
    SessionMapperTest(SessionMapper sessionMapper) {
        this.sessionMapper = sessionMapper;
    }

    private Session session = new Session(
            1L,
            "My session",
            new Date(),
            "Description",
            null,
            Arrays.asList(),
            localDateTime,
            localDateTime
    );

    private SessionDto sessionDto = new SessionDto(
            1L,
            "My session",
            new Date(),
            null,
            "Description",
            Arrays.asList(),
            localDateTime,
            localDateTime
    );


    @Test
    void toSessionTest() {
        Session result = sessionMapper.toEntity(sessionDto);

        assertThat(result).isEqualTo(session);
    }

    @Test
    void toDtoTest() {
        SessionDto result = sessionMapper.toDto(session);

        assertThat(result).isEqualTo(sessionDto);
    }

    @Test
    void toSessionReturnNullTest() {
        Session result = sessionMapper.toEntity(sessionDto);

        assertThat(result).isEqualTo(session);
    }

    @Test
    void toDtoReturnNullTest() {
        SessionDto result = sessionMapper.toDto(session);

        assertThat(result).isEqualTo(sessionDto);
    }

    @Test
    void toUserSessionTest() {
        List<Session> result = sessionMapper.toEntity(Arrays.asList(sessionDto, sessionDto));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(session);
        assertThat(result.get(1)).isEqualTo(session);
    }

    @Test
    void toDtoListTest() {
        List<SessionDto> result = sessionMapper.toDto(Arrays.asList(session, session));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(sessionDto);
        assertThat(result.get(1)).isEqualTo(sessionDto);
    }
}
