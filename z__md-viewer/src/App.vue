<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style lang="less">


header {
  background-color: #42b883;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
</style>
