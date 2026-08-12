<template>

  <div class="container py-5">

    <div class="mb-4">

      <h2 class="fw-bold">
        🌳 Cây gia phả
      </h2>

      <p class="text-muted mb-0">
        Quan hệ các thế hệ trong dòng họ Nguyễn Xuân
      </p>

    </div>


    <!-- LOADING -->

    <div
      v-if="loading"
      class="text-center py-5"
    >

      <div
        class="spinner-border"
        role="status"
      ></div>

      <div class="mt-2 text-muted">
        Đang xây dựng cây gia phả...
      </div>

    </div>


    <!-- ERROR -->

    <div
      v-else-if="error"
      class="alert alert-danger"
    >

      {{ error }}

    </div>


    <!-- TREE -->

    <div v-else>

      <div class="mb-3 text-muted">

        Có
        <strong>{{ treeNodes.length }}</strong>
        nhánh gốc

      </div>


      <div class="family-tree">

        <TreeNode
          v-for="node in treeNodes"
          :key="node.person.ID"
          :node="node"
        />

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue';

import {
  getFamilyOrder
} from '../services/dataService';

import TreeNode from '../components/TreeNode.vue';


// ======================================
// DATA
// ======================================

const treeNodes =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');


// ======================================
// LOAD TREE
// ======================================

async function loadTree() {

  try {

    loading.value = true;

    error.value = '';


    const familyOrder =
      await getFamilyOrder();


    // ==================================
    // TẠO MAP NGƯỜI
    // ==================================

    const personMap =
      new Map();


    familyOrder.forEach(item => {

      personMap.set(
        item.person.ID,
        item.person
      );

    });


    // ==================================
    // TẠO NODE
    // ==================================

    const nodeMap =
      new Map();


    familyOrder.forEach(item => {

      nodeMap.set(
        item.person.ID,
        {

          person:
            item.person,

          depth:
            item.depth,

          spouses: [],

          children: []

        }
      );

    });


    // ==================================
    // GẮN DÂU / RỂ
    // ==================================

    familyOrder.forEach(item => {

      const person =
        item.person;

      const node =
        nodeMap.get(
          person.ID
        );


      const spouseIds =
        person.spouses || [];


      spouseIds.forEach(
        spouseId => {

          const spouse =
            personMap.get(
              spouseId
            );


          if (spouse) {

            node.spouses.push(
              spouse
            );

          }

        }
      );

    });


    // ==================================
    // GẮN CON
    // ==================================

    familyOrder.forEach(item => {

      const person =
        item.person;

      const node =
        nodeMap.get(
          person.ID
        );


      const childIds =
        person.children || [];


      childIds.forEach(
        childId => {

          const childNode =
            nodeMap.get(
              childId
            );


          if (childNode) {

            node.children.push(
              childNode
            );

          }

        }
      );

    });


    // ==================================
    // TÌM ROOT
    // ==================================

    const childIds =
      new Set();


    familyOrder.forEach(item => {

      const children =
        item.person.children || [];


      children.forEach(
        childId => {

          childIds.add(
            childId
          );

        }
      );

    });


    // ==================================
    // ROOT
    // ==================================

    treeNodes.value =
      familyOrder

        .filter(item =>
          !childIds.has(
            item.person.ID
          )
        )

        .map(item =>
          nodeMap.get(
            item.person.ID
          )
        )

        .filter(Boolean);


    // ==================================
    // DEBUG
    // ==================================

    console.log(
      'Tree roots:',
      treeNodes.value
    );

    console.log(
      'Tree total:',
      familyOrder.length
    );


  } catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể xây dựng cây gia phả';

  } finally {

    loading.value = false;

  }

}


// ======================================
// INIT
// ======================================

onMounted(
  loadTree
);

</script>


<style scoped>

.family-tree {

  padding: 10px 0;

}

</style>