package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {
    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @InjectMocks
    private UserService userService;

    private final long USER_ID = 1L;
    private final long SESSION_ID = 1L;

    private Session session;
    private User user;

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
    public void testCreateSession() {
        when(sessionRepository.save(Mockito.any(Session.class))).thenReturn(session);

        Session sessionSaved = sessionService.create(session);

        assertThat(sessionSaved).isNotNull();
        assertThat(sessionSaved.getId()).isEqualTo(session.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testUpdateSession() {
        when(sessionRepository.save(Mockito.any(Session.class))).thenReturn(session);

        Session sessionSaved = sessionService.update(1L, session);

        assertThat(sessionSaved).isNotNull();
        assertThat(sessionSaved.getId()).isEqualTo(session.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @ParameterizedTest(name = "Should call 'deleteById' with {0} as parameter")
    @ValueSource(longs = {0, 1, 2})
    public void testDeleteSession(long id) {
        doNothing().when(sessionRepository).deleteById(id);

        sessionService.delete(id);

        verify(sessionRepository, times(1)).deleteById(id);
    }

    @Test
    public void testGetAllSession() {
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(new Session(), new Session()));

        List<Session> sessions = sessionService.findAll();

        assertThat(sessions.size()).isEqualTo(2);
    }

    @ParameterizedTest(name = "Should get a session with {0} as id")
    @ValueSource(longs = {0, 1, 2})
    public void testGetSession(long id) {
        when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(session));

        Session retrivedSession = sessionService.getById(id);

        assertThat(retrivedSession).isNotNull();
        verify(sessionRepository, times(1)).findById(id);
    }

    @Test
    public void testParticipateSessionNotFoundException() {
        assertThrows(NotFoundException.class, () -> {
            sessionService.participate(SESSION_ID, USER_ID);
        });
    }

    @Test
    public void testNoLongerParticipateNotFoundException() {
        assertThrows(NotFoundException.class, () -> {
            sessionService.noLongerParticipate(SESSION_ID, USER_ID);
        });
    }

    @Test
    public void testParticipateSessionBadRequestException() {
        when(sessionRepository.findById(SESSION_ID)).thenReturn(Optional.of(session));
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> {
            sessionService.participate(SESSION_ID, USER_ID);
        });
    }

    @Test
    public void testNoLongerParticipateBadRequestException() {
        Session emptySession = new Session();
        emptySession.setUsers(new ArrayList<User>());

        when(sessionRepository.findById(SESSION_ID)).thenReturn(Optional.of(emptySession));

        assertThrows(BadRequestException.class, () -> {
            sessionService.noLongerParticipate(SESSION_ID, USER_ID);
        });
    }

    @Test
    public void testParticipate() {
        Session emptySession = new Session();

        emptySession.setUsers(new ArrayList<>());

        when(sessionRepository.findById(SESSION_ID)).thenReturn(Optional.of(emptySession));
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        sessionService.participate(SESSION_ID, USER_ID);

        verify(sessionRepository, times(1)).findById(SESSION_ID);
    }

    @Test
    public void testNoLongerParticipate() {
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(SESSION_ID)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(SESSION_ID, USER_ID);

        verify(sessionRepository, times(1)).findById(SESSION_ID);
    }
}
