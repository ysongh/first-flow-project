pub contract ImageList {

    pub var urls: [String]

    pub fun addURL(newURL: String) {
        self.urls.append(newURL)
    }

    init() {
        self.urls = []
    }

}