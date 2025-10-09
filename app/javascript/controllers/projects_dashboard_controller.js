import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["background", "titleDisplay", "projectInfo", "projectTitle", "projectSubtitle", "projectTagline"]

  connect() {
    console.log("Project Dashboard controller connected")
    console.log("Available targets:", this.targets)
    console.log("backgroundTarget:", this.backgroundTarget)
    
    const firstProjectButton = this.element.querySelector('.project-item')
    if (firstProjectButton) {
      this.currentProject = {
        title: firstProjectButton.dataset.projectTitle,
        subtitle: firstProjectButton.dataset.projectSubtitle,
        background: firstProjectButton.dataset.projectBg
      }
      console.log("Initial currentProject:", this.currentProject)
    }
    
    // Preload all project images for smoother transitions
    this.preloadImages()
  }
  
  preloadImages() {
    const projectButtons = this.element.querySelectorAll('.project-item')
    projectButtons.forEach(button => {
      const imageUrl = button.dataset.projectBg
      if (imageUrl) {
        const img = new Image()
        img.src = imageUrl
        console.log("Preloading image:", imageUrl)
      }
    })
  }

  selectProject(event) {
    console.log("selectProject called", event.currentTarget)
    console.log("Event type:", event.type)
    console.log("Event target:", event.target)
    
    const button = event.currentTarget
    console.log("Button element:", button)
    console.log("Button dataset:", button.dataset)
    
    const projectTitle = button.dataset.projectTitle
    const projectSubtitle = button.dataset.projectSubtitle
    const projectBackground = button.dataset.projectBg

    console.log("Project data:", { projectTitle, projectSubtitle, projectBackground })

    if (!projectTitle || !projectSubtitle || !projectBackground) {
      console.error("Missing project data!")
      return
    }

    this.currentProject = {
      title: projectTitle,
      subtitle: projectSubtitle,
      background: projectBackground
    }

    console.log("Updated currentProject:", this.currentProject)

    this.updateBackground(projectBackground)
    this.updateTitleDisplay(projectTitle)
    this.updateProjectInfo(projectTitle, projectSubtitle)
    this.highlightSelectedProject(button)
  }

  updateBackground(imageUrl) {
    console.log("updateBackground called with:", imageUrl)
    console.log("backgroundTarget:", this.backgroundTarget)
    
    if (!this.backgroundTarget) {
      console.error("backgroundTarget not found!")
      return
    }
    
    if (!imageUrl) {
      console.error("No image URL provided!")
      return
    }
    
    // Add transition class for smooth opacity change
    this.backgroundTarget.style.transition = "opacity 0.3s ease-in-out"
    this.backgroundTarget.style.opacity = "0"
    
    setTimeout(() => {
      this.backgroundTarget.style.backgroundImage = `url('${imageUrl}')`
      console.log("Background image updated to:", imageUrl)
      console.log("Current background style:", this.backgroundTarget.style.backgroundImage)
      
      setTimeout(() => {
        this.backgroundTarget.style.opacity = "1"
        console.log("Background opacity restored to 1")
      }, 50)
    }, 300)
  }

  updateTitleDisplay(title) {
    this.titleDisplayTarget.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
    this.titleDisplayTarget.style.opacity = "0"
    this.titleDisplayTarget.style.transform = "translateY(-10px)"

    setTimeout(() => {
      this.titleDisplayTarget.querySelector("h3").textContent = title
      this.titleDisplayTarget.style.opacity = "1"
      this.titleDisplayTarget.style.transform = "translateY(0)"
    }, 300)
  }

  updateProjectInfo(title, subtitle) {
    this.projectInfoTarget.style.transition = "opacity 0.4s ease-in-out, transform 0.4s ease-in-out"
    this.projectInfoTarget.style.opacity = "0"
    this.projectInfoTarget.style.transform = "translateY(30px)"
    
    setTimeout(() => {
      const titleParts = this.parseTitleParts(title)
      
      this.projectTitleTarget.textContent = titleParts.main
      this.projectSubtitleTarget.textContent = titleParts.sub
      this.projectTaglineTarget.textContent = subtitle
      
      setTimeout(() => {
        this.projectInfoTarget.style.opacity = "1"
        this.projectInfoTarget.style.transform = "translateY(0)"
      }, 100)
    }, 400)
  }

  parseTitleParts(fullTitle) {
    if (fullTitle.includes(":")) {
      const parts = fullTitle.split(":")
      const mainPart = parts[0].trim().toUpperCase()
      const subPart = parts[1].trim()
      
      const mainWords = mainPart.split(" ").filter(word => 
        !["MARVEL'S", "THE", "A", "AN"].includes(word)
      ).join(" ")
      
      return {
        main: mainWords || mainPart,
        sub: subPart
      }
    } else {
      const words = fullTitle.split(" ")
      if (words.length > 2) {
        return {
          main: words.slice(0, -2).join(" ").toUpperCase(),
          sub: words.slice(-2).join(" ")
        }
      }
      return {
        main: fullTitle.toUpperCase(),
        sub: ""
      }
    }
  }

  highlightSelectedProject(selectedButton) {
    const allProjectItems = this.element.querySelectorAll(".project-item")
    allProjectItems.forEach(item => {
      const imageContainer = item.querySelector("div")
      const overlay = imageContainer.querySelector(".bg-gradient-to-t")
      const ring = imageContainer.querySelector(".border-2")
      const img = imageContainer.querySelector("img")
      
      // Reset all items
      imageContainer.classList.remove("project-selected")
      overlay.classList.remove("opacity-100")
      overlay.classList.add("opacity-0")
      ring.classList.remove("border-blue-400", "border-white")
      ring.classList.add("border-transparent")
      img.classList.remove("brightness-110", "scale-105")
      img.classList.add("brightness-100", "scale-100")
    })
    
    // Highlight selected item
    const selectedImageContainer = selectedButton.querySelector("div")
    const selectedOverlay = selectedImageContainer.querySelector(".bg-gradient-to-t")
    const selectedRing = selectedImageContainer.querySelector(".border-2")
    const selectedImg = selectedImageContainer.querySelector("img")
    
    // Add selection classes
    selectedImageContainer.classList.add("project-selected")
    selectedOverlay.classList.remove("opacity-0")
    selectedOverlay.classList.add("opacity-100")
    selectedRing.classList.remove("border-transparent")
    selectedRing.classList.add("border-blue-400")
    selectedImg.classList.remove("brightness-100", "scale-100")
    selectedImg.classList.add("brightness-110", "scale-105")
  }

  // Method to get current project data
  getCurrentProject() {
    return this.currentProject
  }

  // Method to get project by title
  getProjectByTitle(title) {
    const projectButton = this.element.querySelector(`[data-project-title="${title}"]`)
    if (projectButton) {
      return {
        title: projectButton.dataset.projectTitle,
        subtitle: projectButton.dataset.projectSubtitle,
        background: projectButton.dataset.projectBg
      }
    }
    return null
  }

  // Test method to verify controller is working
  test() {
    console.log("Test method called - controller is working!")
    alert("Controller is working!")
  }
}

