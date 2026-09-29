from locust import HttpUser, task, between


class PortfolioUser(HttpUser):
    # Wait between 1 and 3 seconds between requests (realistic human behavior)
    wait_time = between(1, 3)

    @task(3)
    def load_homepage(self):
        self.client.get("/", name="[Page] /")

    @task(3)
    def get_health(self):
        self.client.get("/api/health", name="[API] /api/health")

    @task(2)
    def get_profile(self):
        self.client.get("/api/profile", name="[API] /api/profile")

    @task(2)
    def get_projects(self):
        self.client.get("/api/projects", name="[API] /api/projects")

    @task(2)
    def get_skills(self):
        self.client.get("/api/skills", name="[API] /api/skills")
