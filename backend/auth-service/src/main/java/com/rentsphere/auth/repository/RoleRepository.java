package com.rentsphere.auth.repository;

import com.rentsphere.auth.entity.Role;
import com.rentsphere.auth.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
