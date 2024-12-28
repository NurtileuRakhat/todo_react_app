import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const titleRef = useRef("");
  const summaryRef = useRef("");
  const [currentTask, setCurrentTask] = useState({
    index: null,
    title: "",
    summary: "",
    status: "Not done",
    deadline: "",
  });
  const [filterStatus, setFilterStatus] = useState(null);

  const [themeMode, setThemeMode] = useLocalStorage({
    key: "theme-mode",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const switchTheme = (value) =>
    setThemeMode(value || (themeMode === "dark" ? "light" : "dark"));

  useHotkeys([["mod+T", () => switchTheme()]]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const addTask = () => {
    const newTask = {
      title: titleRef.current.value,
      summary: summaryRef.current.value,
      status: "Not done",
      deadline: "",
    };
    const updatedList = [...tasks, newTask];
    setTasks(updatedList);
    localStorage.setItem("tasks", JSON.stringify(updatedList));
    titleRef.current.value = "";
    summaryRef.current.value = "";
  };

  const removeTask = (idx) => {
    const updatedList = tasks.filter((_, index) => index !== idx);
    setTasks(updatedList);
    localStorage.setItem("tasks", JSON.stringify(updatedList));
  };

  const openEditModal = (task, idx) => {
    setCurrentTask({
      index: idx,
      title: task.title,
      summary: task.summary,
      status: task.status,
      deadline: task.deadline,
    });
    setEditModalOpen(true);
  };

  const saveTaskChanges = () => {
    const updatedList = [...tasks];
    updatedList[currentTask.index] = {
      title: currentTask.title,
      summary: currentTask.summary,
      status: currentTask.status,
      deadline: currentTask.deadline,
    };
    setTasks(updatedList);
    localStorage.setItem("tasks", JSON.stringify(updatedList));
    setEditModalOpen(false);
  };

  const sortTasksByStatus = (status) => {
    const sorted = [...tasks].sort((a, b) => {
      if (a.status === status) return -1;
      if (b.status === status) return 1;
      return 0;
    });
    setTasks(sorted);
    localStorage.setItem("tasks", JSON.stringify(sorted));
  };

  const filterTasksByStatus = (status) => {
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filtered = allTasks.filter((task) => task.status === status);
    setTasks(filtered);
    setFilterStatus(status);
  };

  const sortTasksByDeadline = () => {
    const sorted = [...tasks].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setTasks(sorted);
    localStorage.setItem("tasks", JSON.stringify(sorted));
  };


  return (
    <ColorSchemeProvider
      colorScheme={themeMode}
      toggleColorScheme={switchTheme}
    >
      <MantineProvider
        theme={{ colorScheme: themeMode, defaultRadius: "sm" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="TaskManager">
          <Modal
            opened={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            title="Add New Task"
            centered
            size="lg"
          >
            <TextInput
              ref={titleRef}
              label="Task Title"
              placeholder="Enter task title"
              required
              mb="sm"
            />
            <TextInput
              ref={summaryRef}
              label="Task Summary"
              placeholder="Enter task summary"
              mb="sm"
            />
            <Select
              label="Task Status"
              placeholder="Select status"
              data={[
                { value: "Done", label: "Done" },
                { value: "Not done", label: "Not done" },
                { value: "In Progress", label: "In Progress" },
              ]}
              value="Not done"
              onChange={(value) => {}}
              mb="sm"
              disabled
            />
            <TextInput
              type="date"
              label="Deadline"
              placeholder="Select deadline"
              value=""
              onChange={() => {}}
              mb="sm"
              disabled
            />
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                addTask(); 
                setAddModalOpen(false); 
                  }} >
                  Add Task
              </Button>
            </Group>
          </Modal>

          <Modal
            opened={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit Task"
            centered
            size="lg"
          >
            <TextInput
              label="Task Title"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
              required
              mb="sm"
            />
            <TextInput
              label="Task Summary"
              value={currentTask.summary}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, summary: e.target.value })
              }
              mb="sm"
            />
            <Select
              label="Task Status"
              placeholder="Select status"
              data={[
                { value: "Done", label: "Done" },
                { value: "Not done", label: "Not done" },
                { value: "In Progress", label: "In Progress" },
              ]}
              value={currentTask.status}
              onChange={(value) =>
                setCurrentTask({ ...currentTask, status: value })
              }
              mb="sm"
            />
            <TextInput
              type="date"
              label="Deadline"
              placeholder="Select deadline"
              value={currentTask.deadline}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, deadline: e.target.value })
              }
              mb="sm"
            />
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTaskChanges}>Save</Button>
            </Group>
          </Modal>

          <Container size={900} my={50}>
            <Group position="apart" mb="md">
              <Title order={2}>Task Manager</Title>
              <ActionIcon
                size="lg"
                onClick={() => switchTheme()}
                color={themeMode === "dark" ? "yellow" : "blue"}
              >
                {themeMode === "dark" ? <Sun size={20} /> : <MoonStars size={20} />}
              </ActionIcon>
            </Group>

            <Group Wrap>
              <Button onClick={() => sortTasksByStatus("Done")}>
                Prioritize Done
              </Button>
              <Button onClick={() => sortTasksByStatus("In Progress")}>
                Prioritize In Progress
              </Button>
              <Button onClick={() => sortTasksByStatus("Not done")}>
                Prioritize Not Done
              </Button>
              <Button
                onClick={() => filterTasksByStatus("Done")}
              >
                Filter: Done
              </Button>
              <Button
                onClick={() => filterTasksByStatus("Not done")}
              >
                Filter: Not Done
              </Button>
              <Button
                onClick={() => filterTasksByStatus("In Progress")}
              >
                Filter: In Progress
              </Button>
              <Button onClick={sortTasksByDeadline}>Sort by Deadline</Button>
            </Group>

            {tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <Card key={idx} shadow="sm" p="lg" mb="sm" withBorder>
                  <Group position="apart">
                    <Text weight={500}>{task.title}</Text>
                    <Group spacing="xs">
                      <ActionIcon
                        color="green"
                        onClick={() => openEditModal(task, idx)}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => removeTask(idx)}>
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text size="sm" color="dimmed" mt="sm">
                    {task.summary || "No summary provided."}
                  </Text>
                  <Text size="sm" mt="sm">
                    <strong>Status:</strong> {task.status}
                  </Text>
                  {task.deadline && (
                    <Text size="sm">
                      <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </Text>
                  )}
                </Card>
              ))
            ) : (
              <Text color="dimmed" align="center" mt="md">
                No tasks available. Add a new task to get started!
              </Text>
            )}

            {/* Add Task Button */}
            <Button
              fullWidth
              mt="md"
              onClick={() => setAddModalOpen(true)}
              variant="filled"
            >
              Add New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
