#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { LearningStack } from '../lib/learning-stack';

const app = new cdk.App();
new LearningStack(app, 'LearningStack');
