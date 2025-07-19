<template>
  <div class="space-y-2 mb-6">
    <slot name="label" :field="field">
      <label
        :for="field.path"
        class="text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>
    </slot>

    <slot
      name="input"
      :value="localValue"
      :update="(val: any) => (localValue = val)"
      :field="field"
    >
      <div class="relative">
        <input
          :id="field.path"
          v-model="localValue"
          :type="inputType"
          class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          :class="[
            inputClasses,
            hasIcon ? 'pl-10' : '',
            hasAction ? 'pr-10' : '',
          ]"
          :placeholder="placeholder"
          :autocomplete="autocompleteValue"
        />

        <div
          v-if="hasIcon"
          class="absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <component :is="iconComponent" :class="iconClasses" />
        </div>

        <div
          v-if="hasAction"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <component
            :is="actionComponent"
            @click="handleAction"
            :class="actionClasses"
          />
        </div>
      </div>

      <div v-if="formatHelper" class="text-xs" :class="formatHelper.class">
        {{ formatHelper.text }}
        <button
          v-if="formatHelper.action"
          @click="formatHelper.action.handler"
          class="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          {{ formatHelper.action.text }}
        </button>
      </div>
    </slot>

    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
        {{ errors[0].$message }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any; errors: any[] }>();
const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const formatConfig = computed(() => {
  switch (props.field.format) {
    case "email":
      return {
        type: "email",
        placeholder: "Enter email address",
        autocomplete: "email",
        icon: "EmailIcon",
        validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        helper: getEmailHelper(),
      };
    case "tel":
    case "phone":
      return {
        type: "tel",
        placeholder: "Enter phone number",
        autocomplete: "tel",
        icon: "PhoneIcon",
        validation: /^[\+]?[1-9][\d]{0,15}$/,
        helper: getPhoneHelper(),
      };
    case "url":
    case "uri":
      return {
        type: "url",
        placeholder: "Enter URL (https://...)",
        autocomplete: "url",
        icon: "LinkIcon",
        action: "ExternalLinkIcon",
        validation: (val: string) => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        helper: getUrlHelper(),
      };
    default:
      return {
        type: "text",
        placeholder: props.field.description || "Enter value",
        autocomplete: "off",
        icon: null,
        validation: null,
        helper: null,
      };
  }
});

const inputType = computed(() => formatConfig.value.type);
const placeholder = computed(
  () => props.field.description || formatConfig.value.placeholder,
);
const autocompleteValue = computed(() => formatConfig.value.autocomplete);

const isValid = computed(() => {
  if (!localValue.value) return null;
  const validation = formatConfig.value.validation;
  if (typeof validation === "function") {
    return validation(localValue.value);
  }
  if (validation instanceof RegExp) {
    return validation.test(localValue.value);
  }
  return null;
});

const hasIcon = computed(() => !!formatConfig.value.icon);
const hasAction = computed(() => !!formatConfig.value.action && isValid.value);

const inputClasses = computed(() => {
  if (props.errors.length > 0) {
    return "border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400";
  }
  if (isValid.value === true && localValue.value) {
    return "border-green-300 dark:border-green-700";
  }
  return "";
});

const iconClasses = computed(() => {
  if (props.errors.length > 0) return "text-red-500";
  if (isValid.value === true && localValue.value) return "text-green-500";
  return "text-slate-400 dark:text-slate-500";
});

const actionClasses = computed(
  () =>
    "text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors",
);

const iconComponent = computed(() => {
  const iconName = formatConfig.value.icon;
  return iconName ? createIcon(iconName) : null;
});

const actionComponent = computed(() => {
  const actionName = formatConfig.value.action;
  return actionName ? createIcon(actionName) : null;
});

const formatHelper = computed(() => formatConfig.value.helper);

function getEmailHelper() {
  if (!localValue.value || isValid.value) return null;

  const value = localValue.value.toString();
  const atIndex = value.indexOf("@");

  if (atIndex === -1 || atIndex === value.length - 1) {
    const username = atIndex === -1 ? value : value.substring(0, atIndex);
    if (username.length > 0) {
      return {
        text: "Did you mean:",
        class: "text-slate-600 dark:text-slate-400",
        action: {
          text: `${username}@gmail.com`,
          handler: () => (localValue.value = `${username}@gmail.com`),
        },
      };
    }
  }

  return null;
}

function getPhoneHelper() {
  if (!localValue.value) return null;

  const cleaned = localValue.value.toString().replace(/[^\d+]/g, "");

  if (cleaned.match(/^(\+?1)?(\d{10})$/)) {
    const match = cleaned.match(/^(\+?1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const [, country, area, exchange, number] = match;
      const formatted = `${country ? "+1 " : ""}(${area}) ${exchange}-${number}`;
      if (formatted !== localValue.value) {
        return {
          text: "Format as:",
          class: "text-slate-600 dark:text-slate-400",
          action: {
            text: formatted,
            handler: () => (localValue.value = formatted),
          },
        };
      }
    }
  }

  return null;
}

function getUrlHelper() {
  if (!localValue.value) return null;

  const value = localValue.value.toString();

  if (!value.match(/^https?:\/\//)) {
    return {
      text: "Add protocol:",
      class: "text-amber-600 dark:text-amber-400",
      action: {
        text: `https://${value}`,
        handler: () => (localValue.value = `https://${value}`),
      },
    };
  }

  return null;
}

function createIcon(iconName: string) {
  const icons: Record<string, any> = {
    EmailIcon: () =>
      h(
        "svg",
        {
          class: "h-4 w-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
          }),
        ],
      ),

    PhoneIcon: () =>
      h(
        "svg",
        {
          class: "h-4 w-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
          }),
        ],
      ),

    LinkIcon: () =>
      h(
        "svg",
        {
          class: "h-4 w-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
          }),
        ],
      ),

    ExternalLinkIcon: () =>
      h(
        "svg",
        {
          class: "h-4 w-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
          }),
        ],
      ),
  };

  return icons[iconName] || null;
}

function handleAction() {
  if (props.field.format === "url" && isValid.value && localValue.value) {
    window.open(localValue.value, "_blank", "noopener,noreferrer");
  }
}
</script>

