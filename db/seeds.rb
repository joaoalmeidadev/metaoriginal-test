puts 'WIP SEED'
[
  { title: "The Diplomat", subtitle: "Where Elegance Meets Sky.", path_image: "projects/diplomat.jpg" },
  { title: "Rivage Residences", subtitle: "Luxury Above the City.", path_image: "projects/rivage.png" },
  { title: "Fisher Tower", subtitle: "Experience Sophistication.", path_image: "projects/fisher.png" }
].each do |params_to_project|
  project = Project.create!(title: params_to_project[:title], subtitle: params_to_project[:subtitle])
  
  path = Rails.root.join("app/assets/images", "projects/fisher.png")
  content_type = path.extname == ".png" ? "image/png" : "image/jpeg"

  project.image.attach(
    io: File.open(path),
    filename: File.basename(path),
    content_type: content_type
  )
end