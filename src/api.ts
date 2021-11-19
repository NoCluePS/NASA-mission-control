import { Router } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { getAllPlanets } from './models/planets.ts';
import * as launches from './models/launches.ts';

const router = new Router();

router
  .get('/', (ctx) => {
    ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__ 
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
  })
  .get('/planets', (ctx) => {
    ctx.response.body = getAllPlanets();
  })
  .get('/launches/', (ctx) => {
    ctx.response.body = launches.getAll();
  })
  .get('/launches/:id', (ctx) => {
    ctx.params.id
      ? (ctx.response.body = launches.getOne(Number(ctx.params.id))
          ? launches.getOne(Number(ctx.params.id))
          : ctx.throw(400, "Launch with that ID doesn't exist"))
      : ctx.throw(400, 'Input an ID');
  });

router.post('/launches', async (ctx) => {
  const body = await ctx.request.body().value;

  launches.addOne(body);

  ctx.response.body = { success: true };
  ctx.response.status = 201;
});

router.delete('/launches/:id', (ctx) => {
  if (ctx.params.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = { success: result };
  } else {
    ctx.throw(400, 'Input an ID');
  }
});

export default router;
