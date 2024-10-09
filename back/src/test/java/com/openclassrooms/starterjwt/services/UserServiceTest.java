package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @ParameterizedTest(name = "Should delete use with {0} as id")
    @ValueSource(longs = {0, 1, 2})
    public void testDeleteUser(long id) {
        doNothing().when(userRepository).deleteById(id);

        userService.delete(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @ParameterizedTest(name = "Should get user with {0} as id")
    @ValueSource(longs = {0, 1, 2})
    public void testGetTeacher(long id) {
        when(userRepository.findById(id)).thenReturn(Optional.of(new User(
            1L, "test@tets.com", "Toto", "Titi", "123456789", false, LocalDateTime.now(), LocalDateTime.now()
        )));

        User user = userService.findById(id);

        verify(userRepository, times(1)).findById(id);
        assertThat(user).isNotNull();
    }
}
