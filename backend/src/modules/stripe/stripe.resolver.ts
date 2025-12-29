import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { User } from '../users/entities/user.entity';
import { StripeService } from './stripe.service';

// DTO pour la réponse
@ObjectType()
class CheckoutSessionResponse {
  @Field()
  url: string;
}

@Resolver()
export class StripeResolver {
  constructor(private stripeService: StripeService) {}

  @Mutation(() => CheckoutSessionResponse, {
    description: 'Créer une session Stripe Checkout pour acheter un cours',
  })
  @UseGuards(ClerkGqlGuard)
  async createCheckoutSession(
    @Args('courseId', {
      type: () => String,
      description: 'ID du cours à acheter',
    })
    courseId: string,
    @CurrentUser() user: User,
  ): Promise<CheckoutSessionResponse> {
    console.log('🛒 GraphQL mutation: createCheckoutSession');
    console.log('👤 User:', user.name, '(', user.id, ')');
    console.log('📚 Course ID:', courseId);

    try {
      const result = await this.stripeService.createCheckoutSession(
        courseId,
        user.id,
        user.clerkId || '',
      );

      console.log('✅ Checkout session created successfully');
      return result;
    } catch (error) {
      console.error(
        '❌ Error in createCheckoutSession mutation:',
        error.message,
      );
      throw error;
    }
  }
}
