<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Hero Content -->
        <div class="mb-16">
          <h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Build Forms from
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JSON Schema
            </span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            A lightweight Vue 3 library that automatically generates beautiful, validated forms from JSON Schema definitions. 
            Save time and reduce errors with type-safe form generation.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link
              to="/playground"
              class="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Try Playground
            </router-link>
            
            <a
              href="https://github.com/atkntepe/vue-jsf"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        <!-- Feature Preview -->
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl"></div>
          <div class="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-2xl">
            <div class="grid md:grid-cols-2 gap-8 text-left">
              <!-- Schema Example -->
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">JSON Schema Input</h3>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  <pre class="text-slate-700 dark:text-slate-300 overflow-x-auto"><code>{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Full Name",
      "minLength": 2
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email Address"
    },
    "age": {
      "type": "number",
      "title": "Age",
      "minimum": 18
    }
  },
  "required": ["name", "email"]
}</code></pre>
                </div>
              </div>

              <!-- Generated Form Preview -->
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Generated Form</h3>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input type="text" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder="Enter your name">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input type="email" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder="you@example.com">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                    <input type="number" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder="18">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/20">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Why Choose Vue-JSF?
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to make form building effortless and maintainable
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Lightning Fast</h3>
            <p class="text-slate-600 dark:text-slate-400">Built with Vue 3 Composition API and optimized for performance. Generate forms instantly from your schemas.</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Validation</h3>
            <p class="text-slate-600 dark:text-slate-400">Comprehensive validation using Vuelidate with support for all JSON Schema validation rules.</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Beautiful Design</h3>
            <p class="text-slate-600 dark:text-slate-400">Styled with Tailwind CSS out of the box. Fully customizable with slots and component registry.</p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">TypeScript First</h3>
            <p class="text-slate-600 dark:text-slate-400">Built with TypeScript for better developer experience with full type safety and IntelliSense.</p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Rich Field Types</h3>
            <p class="text-slate-600 dark:text-slate-400">Support for all standard form fields plus advanced types like arrays, objects, and formatted inputs.</p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="h-12 w-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 012-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Extensible</h3>
            <p class="text-slate-600 dark:text-slate-400">Easy to extend with custom components and integrations. Works with popular UI libraries.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8">
          Get Started in Minutes
        </h2>
        
        <div class="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-left shadow-2xl border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2 mb-6">
            <div class="flex gap-2">
              <div class="h-3 w-3 bg-red-500 rounded-full"></div>
              <div class="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <div class="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-slate-400 text-sm ml-4">Terminal</span>
          </div>
          
          <div class="font-mono text-slate-100 space-y-4">
            <div class="flex items-center">
              <span class="text-green-400 mr-2">$</span>
              <span>npm install vue-jsf</span>
            </div>
            <div class="text-slate-400"># Install the package</div>
            
            <div class="flex items-center mt-6">
              <span class="text-green-400 mr-2">$</span>
              <span>npm install @vuelidate/core @vuelidate/validators</span>
            </div>
            <div class="text-slate-400"># Install peer dependencies</div>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/playground"
            class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try it Now
          </router-link>
          
          <router-link
            to="/docs"
            class="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Read Documentation
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// This is the landing page - no complex logic needed yet
</script>