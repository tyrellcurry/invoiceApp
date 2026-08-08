import { render } from '@testing-library/react';
import Grid from '@/components/ui/grid/grid';

describe('Grid Component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Grid align="center" cols={3} gap={4}>
        content
      </Grid>
    );
    expect(container).toMatchSnapshot();
  });
});
