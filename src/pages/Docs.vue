<template>
  <div class="min-h-screen">
    <!-- Documentation Header -->
    <div class="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Documentation
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn how to build powerful forms with Vue-JSF. From basic usage to advanced customization.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar Navigation -->
        <div class="lg:w-64 flex-shrink-0">
          <nav class="sticky top-8">
            <div class="space-y-8">
              <!-- Getting Started -->
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                  Getting Started
                </h3>
                <ul class="space-y-2">
                  <li>
                    <a href="#installation" @click="scrollTo('installation')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Installation
                    </a>
                  </li>
                  <li>
                    <a href="#quick-start" @click="scrollTo('quick-start')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Quick Start
                    </a>
                  </li>
                  <li>
                    <a href="#basic-usage" @click="scrollTo('basic-usage')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Basic Usage
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Components -->
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                  Components
                </h3>
                <ul class="space-y-2">
                  <li>
                    <a href="#schema-form" @click="scrollTo('schema-form')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      SchemaForm
                    </a>
                  </li>
                  <li>
                    <a href="#field-types" @click="scrollTo('field-types')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Field Types
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Advanced -->
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                  Advanced
                </h3>
                <ul class="space-y-2">
                  <li>
                    <a href="#validation" @click="scrollTo('validation')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Validation
                    </a>
                  </li>
                  <li>
                    <a href="#customization" @click="scrollTo('customization')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Customization
                    </a>
                  </li>
                  <li>
                    <a href="#schema-features" @click="scrollTo('schema-features')" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm cursor-pointer">
                      Schema Features
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 max-w-4xl">
          <div class="prose prose-slate dark:prose-invert max-w-none">
            <!-- Coming Soon Notice -->
            <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12">
              <div class="flex items-start gap-3">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Documentation Coming Soon</h3>
                  <p class="text-blue-800 dark:text-blue-200 mb-4">
                    We're working hard to create comprehensive documentation for Vue-JSF. In the meantime, check out the playground to see the library in action!
                  </p>
                  <router-link
                    to="/playground"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Try Playground
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Placeholder Sections -->
            <section id="installation" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Installation</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Install Vue-JSF using your preferred package manager:</p>
                <div class="bg-slate-900 rounded-md p-4 font-mono text-sm">
                  <div class="text-green-400 mb-2"># npm</div>
                  <div class="text-slate-100">npm install vue-jsf</div>
                  <div class="text-green-400 mt-4 mb-2"># yarn</div>
                  <div class="text-slate-100">yarn add vue-jsf</div>
                </div>
              </div>
            </section>

            <section id="quick-start" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Start</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Get up and running with Vue-JSF in just a few lines of code.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="basic-usage" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Basic Usage</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Learn the fundamentals of creating forms with JSON Schema.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="schema-form" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">SchemaForm Component</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">The main component for rendering forms from JSON Schema.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="field-types" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Field Types</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Overview of all supported field types and their configurations.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="validation" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Validation</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">How validation works with JSON Schema and Vuelidate integration.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="customization" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Customization</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Learn how to customize components, styling, and behavior.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <section id="schema-features" class="mb-12">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Advanced Schema Features</h2>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p class="text-slate-600 dark:text-slate-400 mb-4">Explore advanced JSON Schema features like oneOf, anyOf, $ref, and conditional validation.</p>
                <div class="text-sm text-slate-500 dark:text-slate-400">Documentation content will be added here...</div>
              </div>
            </section>

            <!-- Feedback Section -->
            <section class="mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Have Questions or Suggestions?</h3>
              <p class="text-slate-600 dark:text-slate-400 mb-4">
                We'd love to hear from you! Help us improve the documentation by sharing your feedback.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://github.com/atkntepe/vue-jsf/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Report Issue
                </a>
                <a
                  href="https://github.com/atkntepe/vue-jsf/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Start Discussion
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>