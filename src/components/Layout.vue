<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Navigation -->
    <nav class="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center gap-3">
              <div class="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-50">Vue-JSF</h1>
                <p class="text-xs text-slate-600 dark:text-slate-400 -mt-0.5">JSON Schema Forms</p>
              </div>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-8">
            <router-link 
              to="/" 
              class="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              :class="$route.name === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'"
            >
              Home
            </router-link>
            <router-link 
              to="/playground" 
              class="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              :class="$route.name === 'playground' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'"
            >
              Playground
            </router-link>
            <router-link 
              to="/docs" 
              class="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              :class="$route.name === 'docs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'"
            >
              Documentation
            </router-link>
            <router-link 
              to="/ui-schema" 
              class="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              :class="$route.name === 'ui-schema' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'"
            >
              UI Schema
            </router-link>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle dark mode"
          >
            <svg
              v-if="isDarkMode"
              class="h-5 w-5 text-slate-900 dark:text-slate-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="h-5 w-5 text-slate-900 dark:text-slate-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <!-- Mobile menu button -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-slate-200 dark:border-slate-700">
        <div class="px-4 py-3 space-y-1">
          <router-link 
            to="/" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'home' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            Home
          </router-link>
          <router-link 
            to="/playground" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'playground' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            Playground
          </router-link>
          <router-link 
            to="/docs" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'docs' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            Documentation
          </router-link>
          <router-link 
            to="/ui-schema" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'ui-schema' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            UI Schema
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)
const showMobileMenu = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  updateDarkMode()
}

const updateDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && systemPreference)) {
    isDarkMode.value = true
  }

  updateDarkMode()
})
</script>