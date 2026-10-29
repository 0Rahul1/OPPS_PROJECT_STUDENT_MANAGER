cmake_minimum_required(VERSION 3.16)
project(StudentManagementSystem VERSION 1.1.0 LANGUAGES CXX)

# Set C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Collect all project source files
set(SOURCES
    src/main.cpp
    src/Person.cpp
    src/Student.cpp
    src/UndergraduateStudent.cpp
    src/DatabaseConfig.cpp
    src/DatabaseConnection.cpp
    src/StudentRepository.cpp
    src/MongoStudentRepository.cpp
    src/Menu.cpp
)

set(HEADERS
    src/Person.h
    src/Student.h
    src/UndergraduateStudent.h
    src/IStudentRepository.h
    src/DatabaseConfig.h
    src/DatabaseConnection.h
    src/StudentRepository.h
    src/MongoStudentRepository.h
    src/Menu.h
)

# Create Executable Target
add_executable(StudentManagementSystem ${SOURCES} ${HEADERS})

# Include project src directory
target_include_directories(StudentManagementSystem PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)

# ------------------------------------------------------------------------------
# 1. MySQL Connector/C++ (Stable JDBC Legacy API) Configuration
# ------------------------------------------------------------------------------
if(DEFINED ENV{MYSQL_CONNECTOR_DIR} AND NOT DEFINED MYSQL_CONNECTOR_DIR)
    set(MYSQL_CONNECTOR_DIR $ENV{MYSQL_CONNECTOR_DIR})
endif()

set(SEARCH_PATHS
    "${MYSQL_CONNECTOR_DIR}"
    "C:/Program Files/MySQL/Connector C++ 8.4"
    "C:/Program Files/MySQL/Connector C++ 8.0"
    "C:/Program Files/MySQL/MySQL Connector C++ 8.4"
    "C:/Program Files/MySQL/MySQL Connector C++ 8.0"
    "C:/Program Files/MySQL/Connector C++ 9.0"
    "C:/Program Files (x86)/MySQL/Connector C++ 8.0"
    "D:/MySQL/Connector C++ 8.4"
    "D:/MySQL/Connector C++ 8.0"
)

find_path(MYSQL_INCLUDE_DIR
    NAMES mysql/jdbc.h jdbc/mysql_driver.h mysql_driver.h
    PATHS ${SEARCH_PATHS}
    PATH_SUFFIXES include include/jdbc
    DOC "Path to MySQL Connector/C++ include directory"
)

find_library(MYSQL_LIB
    NAMES mysqlcppconn mysqlcppconn8-static mysqlcppconn-static
    PATHS ${SEARCH_PATHS}
    PATH_SUFFIXES lib64/vs14 lib64 lib/vs14 lib
    DOC "Path to mysqlcppconn library"
)

message(STATUS "--------------------------------------------------------")
message(STATUS "MySQL Connector/C++ Include Dir: ${MYSQL_INCLUDE_DIR}")
message(STATUS "MySQL Connector/C++ Library:     ${MYSQL_LIB}")
message(STATUS "--------------------------------------------------------")

if(MYSQL_INCLUDE_DIR AND MYSQL_LIB)
    target_include_directories(StudentManagementSystem PRIVATE
        ${MYSQL_INCLUDE_DIR}
        ${MYSQL_INCLUDE_DIR}/jdbc
    )
    target_link_libraries(StudentManagementSystem PRIVATE ${MYSQL_LIB})
    target_compile_definitions(StudentManagementSystem PRIVATE HAS_MYSQL_CONNECTOR=1)

    # Post-build: Copy MySQL runtime DLL on Windows
    get_filename_component(MYSQL_LIB_DIR "${MYSQL_LIB}" DIRECTORY)
    find_file(MYSQL_RUNTIME_DLL
        NAMES mysqlcppconn-9-vs14.dll mysqlcppconn-8-vs14.dll mysqlcppconn.dll libmysqlcppconn.dll
        PATHS "${MYSQL_LIB_DIR}" "${MYSQL_LIB_DIR}/../bin"
    )

    if(MYSQL_RUNTIME_DLL)
        add_custom_command(TARGET StudentManagementSystem POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
            "${MYSQL_RUNTIME_DLL}"
            $<TARGET_FILE_DIR:StudentManagementSystem>
            COMMENT "Copying MySQL Connector runtime DLL to output directory"
        )
    endif()
else()
    message(WARNING "MySQL Connector/C++ was not detected in standard directories. "
                    "You can supply the path via: cmake -DMYSQL_CONNECTOR_DIR=\"C:/path/to/connector\" ..")
endif()

# ------------------------------------------------------------------------------
# 2. MongoDB C++ Driver (mongocxx / bsoncxx) Configuration (Optional)
# ------------------------------------------------------------------------------
find_package(mongocxx CONFIG QUIET)
find_package(bsoncxx CONFIG QUIET)

if(mongocxx_FOUND AND bsoncxx_FOUND)
    message(STATUS "MongoDB C++ Driver detected (mongocxx & bsoncxx).")
    target_link_libraries(StudentManagementSystem PRIVATE mongo::mongocxx_shared mongo::bsoncxx_shared)
    target_compile_definitions(StudentManagementSystem PRIVATE HAS_MONGOCXX=1)
else()
    message(STATUS "MongoDB C++ Driver not found on system. Built-in polyglot JSON document engine active.")
endif()

# ------------------------------------------------------------------------------
# 3. Post-build Configuration Template Copy
# ------------------------------------------------------------------------------
add_custom_command(TARGET StudentManagementSystem POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    "${CMAKE_CURRENT_SOURCE_DIR}/.env.example"
    "$<TARGET_FILE_DIR:StudentManagementSystem>/.env.example"
    COMMENT "Copying configuration template to output directory"
)
