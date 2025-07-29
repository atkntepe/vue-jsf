<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Hero Content -->
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Build Forms from
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JSON Schema
            </span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
            A lightweight Vue 3 library that automatically generates beautiful, validated forms from JSON Schema definitions.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <router-link
              to="/playground"
              class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Try Playground
            </router-link>
            
            <a
              href="https://github.com/atkntepe/vue-jsf"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        <!-- Feature Preview -->
        <div class="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 text-left">
          <div class="grid md:grid-cols-2">
            <!-- Schema Example -->
            <div class="p-6 border-r border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-2 mb-3">
                <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100">JSON Schema Input</h3>
              </div>
              <div class="bg-slate-50 dark:bg-slate-900 rounded-md p-3 font-mono text-xs">
                <pre class="text-slate-700 dark:text-slate-300 overflow-x-auto text-left"><code>{
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
    }
  },
  "required": ["name", "email"]
}</code></pre>
              </div>
            </div>

            <!-- Generated Form Preview -->
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100">Generated Form</h3>
              </div>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input type="text" class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" placeholder="Enter your name">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input type="email" class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" placeholder="you@example.com">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Why Choose Vue-JSF?
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Powerful features designed to make form building effortless
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <!-- Feature 1 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Lightning Fast</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Built with Vue 3 Composition API and optimized for performance.</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Full Validation</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Comprehensive validation using Vuelidate with JSON Schema rules.</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Beautiful Design</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Styled with Tailwind CSS and fully customizable components.</p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">TypeScript First</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Built with TypeScript for full type safety and IntelliSense.</p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Rich Field Types</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Support for arrays, objects, and advanced formatted inputs.</p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div class="h-8 w-8 bg-pink-100 dark:bg-pink-900/30 rounded-md flex items-center justify-center mb-3">
              <svg class="h-4 w-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 012-2z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Extensible</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">Easy to extend with custom components and integrations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Get Started in Minutes
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Install and start using Vue-JSF in your project
        </p>
        
        <div class="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 text-left border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 mb-3">
            <div class="flex gap-1.5">
              <div class="h-2 w-2 bg-red-500 rounded-full"></div>
              <div class="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-slate-400 text-xs ml-2">Terminal</span>
          </div>
          
          <div class="font-mono text-slate-100 space-y-2 text-sm">
            <div class="flex items-center">
              <span class="text-green-400 mr-2">$</span>
              <span>npm install vue-jsf</span>
            </div>
            <div class="text-slate-500 text-xs"># Install the package</div>
            
            <div class="flex items-center mt-3">
              <span class="text-green-400 mr-2">$</span>
              <span>npm install @vuelidate/core @vuelidate/validators</span>
            </div>
            <div class="text-slate-500 text-xs"># Install peer dependencies</div>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/playground"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Try it Now
          </router-link>
          
          <router-link
            to="/docs"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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