package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
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
public class UserMapperTest {
    private final UserMapper userMapper;

    private LocalDateTime localDateTime = LocalDateTime.now();

    @Autowired
    UserMapperTest(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    User user = new User(
            1L,
            "test@tets.com",
            "Toto",
            "Titi",
            "123456789",
            false,
            localDateTime,
            localDateTime
    );

    UserDto userDto = new UserDto(
            1L,
            "test@tets.com",
            "Toto",
            "Titi",
            false,
            "123456789",
            localDateTime,
            localDateTime
    );

    @Test
    void toUserTest() {
        User result = userMapper.toEntity(userDto);

        assertThat(result).isEqualTo(user);
    }

    @Test
    void toDtoTest() {
        UserDto result = userMapper.toDto(user);

        assertThat(result).isEqualTo(userDto);
    }

    @Test
    void toUserListTest() {
        List<User> result = userMapper.toEntity(Arrays.asList(userDto, userDto));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(user);
        assertThat(result.get(1)).isEqualTo(user);
    }

    @Test
    void toDtoListTest() {
        List<UserDto> result = userMapper.toDto(Arrays.asList(user, user));

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0)).isEqualTo(userDto);
        assertThat(result.get(1)).isEqualTo(userDto);
    }
}
