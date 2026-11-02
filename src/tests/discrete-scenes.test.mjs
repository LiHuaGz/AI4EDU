import test from 'node:test';
import assert from 'node:assert/strict';
import { combinations, theoreticalProbability, sampleDraw, eventMatches } from '../public/scenes/probability.js';
import { edgeBetween, pathCost, routeProgress, shortestDistance } from '../public/scenes/network.js';

const population = [{ id: 'red', label: '红球', count: 2 }, { id: 'blue', label: '蓝球', count: 3 }];
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual}与${expected}不一致`);

test('组合数处理边界，放回抽样遵循二项分布', () => {
  assert.equal(combinations(5, 2), 10);
  assert.equal(combinations(5, 0), 1);
  assert.equal(combinations(5, 6), 0);
  closeTo(theoreticalProbability({ population, draws: 3, replacement: true, event: { type: 'exactly', targetId: 'red', count: 2 } }), 3 * .4 ** 2 * .6);
  closeTo(theoreticalProbability({ population, draws: 3, replacement: true, event: { type: 'atLeast', targetId: 'red', count: 1 } }), 1 - .6 ** 3);
});

test('不放回抽样使用超几何概率，全部同类与全部不同分别计算', () => {
  closeTo(theoreticalProbability({ population, draws: 2, replacement: false, event: { type: 'exactly', targetId: 'red', count: 1 } }), .6);
  closeTo(theoreticalProbability({ population, draws: 2, replacement: false, event: { type: 'allSame' } }), .4);
  closeTo(theoreticalProbability({ population, draws: 2, replacement: false, event: { type: 'allDifferent' } }), .6);
  closeTo(theoreticalProbability({ population, draws: 2, replacement: true, event: { type: 'allSame' } }), .52);
  closeTo(theoreticalProbability({ population, draws: 2, replacement: true, event: { type: 'allDifferent' } }), .48);
  assert.equal(theoreticalProbability({ population, draws: 3, replacement: false, event: { type: 'allDifferent' } }), 0);
});

test('三类对象的全部不同概率计算抽取顺序，概率互补关系正确', () => {
  const three = [...population, { id: 'green', count: 1 }];
  closeTo(theoreticalProbability({ population: three, draws: 3, replacement: false, event: { type: 'allDifferent' } }), .3);
  closeTo(theoreticalProbability({ population: three, draws: 3, replacement: true, event: { type: 'allDifferent' } }), 1 / 6);
  assert.equal(theoreticalProbability({ population, draws: 6, replacement: false, event: { type: 'allSame' } }), null);
  assert.equal(theoreticalProbability({ population, draws: 2, replacement: true, event: { type: 'atLeast', targetId: 'red', count: 0 } }), 1);
});

test('抽样正确消耗不放回总体，随机边界可重复验证', () => {
  assert.deepEqual(sampleDraw(population, 4, false, () => 0), ['red', 'red', 'blue', 'blue']);
  assert.deepEqual(sampleDraw(population, 4, true, () => 0), ['red', 'red', 'red', 'red']);
  assert.deepEqual(sampleDraw(population, 3, false, () => 1), ['blue', 'blue', 'blue']);
  assert.equal(eventMatches(['red', 'blue', 'red'], { type: 'exactly', targetId: 'red', count: 2 }), true);
  assert.equal(eventMatches(['red', 'red'], { type: 'allDifferent' }), false);
});

const nodes = ['A', 'B', 'C', 'D'].map(id => ({ id }));
const edges = [{ from: 'A', to: 'B', weight: 2 }, { from: 'B', to: 'D', weight: 7 }, { from: 'A', to: 'C', weight: 4 }, { from: 'C', to: 'D', weight: 3 }, { from: 'B', to: 'C', weight: 1 }];

test('路径累计代价保留往返与重复路段，非法相邻节点不能构成路线', () => {
  assert.equal(pathCost(['A', 'B', 'C', 'D'], edges), 6);
  assert.equal(pathCost(['A', 'B', 'A', 'C', 'D'], edges), 11);
  assert.equal(pathCost(['A', 'D'], edges), null);
  assert.equal(edgeBetween(edges, 'C', 'B', false).weight, 1);
  assert.equal(edgeBetween(edges, 'C', 'B', true), undefined);
});

test('最短路尊重方向和权值，断开的图返回不可达', () => {
  assert.equal(shortestDistance(nodes, edges, 'A', 'D'), 6);
  assert.equal(shortestDistance(nodes, edges, 'D', 'A'), 6);
  assert.equal(shortestDistance(nodes, edges, 'D', 'A', true), null);
  assert.equal(shortestDistance(nodes, edges, 'A', 'D', true), 6);
  assert.equal(shortestDistance(nodes, edges.slice(0, 1), 'A', 'D'), null);
  assert.equal(shortestDistance(nodes, edges, 'A', 'A'), 0);
});

test('必经条件改变最短路，提前抵达终点仍标为任务未完成', () => {
  const stops = ['S', 'R', 'B', 'T'].map(id => ({ id }));
  const roads = [{ from: 'S', to: 'T', weight: 1 }, { from: 'S', to: 'R', weight: 2 }, { from: 'R', to: 'B', weight: 3 }, { from: 'B', to: 'T', weight: 4 }];
  assert.equal(shortestDistance(stops, roads, 'S', 'T', true), 1);
  assert.equal(shortestDistance(stops, roads, 'S', 'T', true, ['R', 'B']), 9);
  assert.deepEqual(routeProgress(['S', 'T'], 'T', ['R', 'B']), {
    atDestination: true, visitedRequired: [], missingRequired: ['R', 'B'], complete: false,
  });
  assert.equal(routeProgress(['S', 'R', 'B', 'T'], 'T', ['R', 'B']).complete, true);
  assert.equal(routeProgress(['S', 'R', 'B'], 'T', ['R', 'B']).complete, false);
});

test('必经点访问次序由总代价决定，分别可达不代表可以同时覆盖', () => {
  const stops = ['S', 'R', 'B', 'T'].map(id => ({ id }));
  const roads = [{ from: 'S', to: 'R', weight: 1 }, { from: 'R', to: 'B', weight: 10 }, { from: 'B', to: 'T', weight: 1 }, { from: 'S', to: 'B', weight: 4 }, { from: 'B', to: 'R', weight: 2 }, { from: 'R', to: 'T', weight: 1 }];
  assert.equal(shortestDistance(stops, roads, 'S', 'T', true, ['R', 'B']), 7);
  const branches = [{ from: 'S', to: 'R', weight: 1 }, { from: 'S', to: 'B', weight: 1 }, { from: 'R', to: 'T', weight: 1 }, { from: 'B', to: 'T', weight: 1 }];
  assert.equal(shortestDistance(stops, branches, 'S', 'T', true, ['R']), 2);
  assert.equal(shortestDistance(stops, branches, 'S', 'T', true, ['B']), 2);
  assert.equal(shortestDistance(stops, branches, 'S', 'T', true, ['R', 'B']), null);
});

test('访问状态保留六个必经点，并支持回到起点的完整环行', () => {
  const stops = ['S', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'T'].map(id => ({ id }));
  const roads = stops.slice(1).map((node, index) => ({ from: stops[index].id, to: node.id, weight: 1 }));
  assert.equal(shortestDistance(stops, roads, 'S', 'T', true, ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']), 7);
  assert.equal(shortestDistance(nodes, edges, 'A', 'A', false, ['B']), 4);
  assert.equal(shortestDistance(nodes, edges, 'A', 'D', false, ['A', 'D']), 6);
});
