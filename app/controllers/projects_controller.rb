class ProjectsController < ApplicationController
  def index 
    @projects = [
      {
        title: "The Diplomat",
        subtitle: "Where Elegance Meets Sky.",
        background_path: view_context.asset_path("projects/diplomat.jpg"),
        thumb_path: view_context.asset_path("projects/diplomat.jpg")
      },
      {
        title: "Rivage Residences",
        subtitle: "Luxury Above the City.",
        background_path: view_context.asset_path("projects/rivage.png"),
        thumb_path: view_context.asset_path("projects/rivage.png")
      },
      {
        title: "Fisher Tower",
        subtitle: "Experience Sophistication.",
        background_path: view_context.asset_path("projects/fisher.png"),
        thumb_path: view_context.asset_path("projects/fisher.png")
      },
    ]
  end
end